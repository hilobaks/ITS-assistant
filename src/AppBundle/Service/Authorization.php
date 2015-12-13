<?php
/**
 * Created by PhpStorm.
 * User: h_baks
 * Date: 03.12.15
 * Time: 1:57
 */

namespace AppBundle\Service;

use \Doctrine\ORM\EntityManager;
use AppBundle\Entity\Users;

class Authorization
{
    const STATUS_OK = 'ok';
    const STATUS_WRONG = 'wrong';
    const STATUS_BLOCKED = 'blocked';
    const STATUS_NOT_FOUND = 'not_found';
    private static $count_try = 3;
    private $em;

    public function __construct(EntityManager $entityManager) {
        $this->em = $entityManager;
    }

    public function check_login($user, $request) {
        if(self::$count_try < 1) {
            return self::STATUS_BLOCKED;
        } else {
            self::$count_try--;
        }
        if($user) {
            if($user->getPassword() === $request->get('password')) {
                return self::STATUS_OK;
            } else {
                return self::STATUS_WRONG;
            }
        } else {
            return self::STATUS_NOT_FOUND;
        }
    }

    public function getUserByEmail($email) {
        $user = $this->em
            ->getRepository('AppBundle:Users')
            ->findOneBy(['email' => $email]);
        return $user;
    }
}