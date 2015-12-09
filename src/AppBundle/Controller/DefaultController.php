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


class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
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
        $status_authorization = $request->getSession()->get('authorization');
        if($status_authorization) {
            return $this->render('default/index.html.twig' ,
                 [
                     'authorization' => $status_authorization,
                     'full_name' => $request->getSession()->get('full')
                 ]
                );
        } else {
            $user = $this->getUserByEmail($request);
            $service_authorization = $this->get('authorization');
            $status = $service_authorization->check_login($user, $request);
            switch ($status['message']) {
                case $service_authorization::STATUS_OK :
                    $request->getSession()->set('full-name', $user->getFirstName().' '.$user->getSecondName());
                    $request->getSession()->set('authorization', true);
                    break;
            }
            return new JsonResponse(
                [
                    'message' => $status['message'],
                    'countTry' => $status['count_try']
                ]
            );
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
     * @Route("/check_email/{}", name="check_email")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function checkEmailAction(Request $request) {
        try {
            if($this->getUserByEmail($request)) {
                return new JsonResponse(true, 404);
            } else {
                return new JsonResponse(false, 200);
            }
        } catch(\Exception $error) {
            return new JsonResponse(false, 500);
        }
    }

    private function getUserByEmail(Request $request) {
        $user = $this->getDoctrine()
            ->getRepository('AppBundle:Users')
            ->findOneBy(['email' => $request->get('email')]);
        return $user;
    }
}
