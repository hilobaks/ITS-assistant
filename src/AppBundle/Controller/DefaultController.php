<?php

namespace AppBundle\Controller;

use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\Users;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;



class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $status_auth = $request->getSession()->get('auth');
        return $this->render(
            ':default:index.html.twig' ,
            [
                'auth' => $status_auth,
                'full_name' => $request->getSession()->get('full-name')
            ]
        );
    }

    /**
     * @Route("/registration", name="registration")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function registrationAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/registration.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
    }

    /**
     * @Route("/sign_up", name="sign_up")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function signUpAction(Request $request)
    {
        $generator = new ComputerPasswordGenerator();
        $generator
            ->setUppercase()
            ->setLowercase()
            ->setNumbers()
            ->setSymbols(false)
            ->setLength(6);
        ;
        $password = $generator->generatePassword();

        $users = new Users();
        $login = $request->get('first-name');
        $email = $request->get('email');
        $users->setFirstName($login);
        $users->setSecondName($request->get('second-name'));
        $users->setPatronymic($request->get('patronymic'));
        $users->setEmail($email);
        $users->setUseReason($request->get('use-reason'));
        $users->setPassword($password);

        $em = $this->getDoctrine()->getManager();

        try {
            $em->persist($users);
            $em->flush();
        } catch(\Exception $error) {

        }
        $this->mailSend([
            'login' =>  $email,
            'password' => $password
        ]);

        return $this->render('default/thanks.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
    }

    /**
     * @Route("/login", name="login")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function loginAction(Request $request)
    {
        return $this->render('default/login.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
    }

    /**
     * @Route("/sign_in", name="sign_in")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function signInAction(Request $request)
    {
        $status_auth = $request->getSession()->get('auth');
        if($status_auth) {
            return $this->redirectToRoute('homepage');
        } else {
            try {
                $auth_service = $this->get('authorization');
                $user = $auth_service->getUserByEmail($request->get('email'));
                $status = $auth_service->check_login($user, $request);
                switch ($status) {
                    case $auth_service::STATUS_OK :
                        $request->getSession()->set('full-name', $user->getFirstName().' '.$user->getSecondName());
                        $request->getSession()->set('auth', true);
                        return new JsonResponse(true, 200);
                        break;
                    case $auth_service::STATUS_WRONG :
                        return new JsonResponse(false, 403);
                        break;
                    case $auth_service::STATUS_BLOCKED :
                        return new JsonResponse(false, 423);
                        break;
                    case $auth_service::STATUS_NOT_FOUND :
                        return new JsonResponse(false, 404);
                        break;
                }
            } catch (HttpException $error) {
                return new JsonResponse(false, $error->getStatusCode());
            }
        }
    }

    /**
     * @Route("/send_again", name="send_again")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function sendAgainAction(Request $request)
    {
        $auth_service = $this->get('authorization');
        $user = $auth_service->getUserByEmail($request->get('email'));
        if($user) {
            $this->mailSend([
                'login' =>  $user->getEmail(),
                'password' => $user->getPassword()
            ]);
            return new Response('', 200);
        } else {
            return new Response('', 404);
        }
    }

    private function mailSend($info) {
        $message = \Swift_Message::newInstance()
            ->setFrom('bover09@gmail.com')
            ->setTo($info['login'])
            ->setSubject('Регистрация в ITS-assistant')
            ->setBody(
                $this->renderView(
                    'email/message.html.twig' , array('info' => $info)
                ),
                'text/html'
            );
        $this->get('mailer')->send($message);
    }

    /**
     * @Route("/check_email", name="check_email")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function checkEmailAction(Request $request) {
        try {
            if(!($this->get('authorization')->getUserByEmail($request->get('email')))) {
                return new JsonResponse(true, 200);
            } else {
                return new JsonResponse(false, 403);
            }
        } catch(HttpException $error) {
            return new JsonResponse(false, $error->getStatusCode());
        }
    }

    /**
     * @Route("/logout", name="logout")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function logoutAction(Request $request) {
        $request->getSession()->remove('auth');
        return new Response('', 200);
    }

    /**
     * @Route("/create_report", name="create_report")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function createReportAction(Request $request) {
        $filesystem = new Filesystem();
        $filesystem->touch('report.doc');
        $content = $this->render(':default:report.html.twig', []);
        $filesystem->dumpFile('report.doc', $content);
        $response = new Response();
        $response->headers->set('Content-Type', 'text/plain');
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            'filename.txt'
        );

        $response->headers->set('Content-Disposition', $d);
    }
}
