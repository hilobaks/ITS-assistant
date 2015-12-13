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


class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render(
            'default/index.html.twig',
            [
                'auth' => false
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
        $status_authorization = $request->getSession()->get('auth');
        if($status_authorization) {
            return $this->render(
                 ':default:index.html.twig' ,
                 [
                     'auth' => $status_authorization,
                     'full_name' => $request->getSession()->get('full-name')
                 ]
                );
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


}
