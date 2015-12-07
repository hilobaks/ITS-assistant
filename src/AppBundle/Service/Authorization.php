<?php
/**
 * Created by PhpStorm.
 * User: h_baks
 * Date: 03.12.15
 * Time: 1:57
 */

namespace AppBundle\Service;

use AppBundle\Entity\FiscalData;
use AppBundle\Entity\FiscalRequest;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Constraints\DateTime;

class Authorization
{
    const STATUS_OK = 'ok';
    const STATUS_WRONG = 'wrong';
    const STATUS_BLOCKED = 'blocked';
    const STATUS_NOT_FOUND = 'not_found';


    public function check_login($user, $request) {
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
}