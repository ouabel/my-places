<?php

namespace App\Controller;

use App\Entity\ApiToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();

        $apiToken = new ApiToken($user);
        $em->persist($apiToken);
        $em->flush();

        return $this->json($apiToken, Response::HTTP_OK, [], ['groups' => 'login']);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
