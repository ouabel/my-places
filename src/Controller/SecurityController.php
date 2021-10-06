<?php

namespace App\Controller;

use App\Entity\ApiToken;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Annotations as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    /**
     * Login
     *
     * Get api token for authentication
     *
     * @Route("/login", name="login", methods={"POST"})
     * @OA\Response(
     *     response=200,
     *     description="Successful login",
     *     content={
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="token",
     *                     type="string",
     *                     description="Bearer token"
     *                 ),
     *                 @OA\Property(
     *                     property="expiresAt",
     *                     type="date",
     *                     description="Expiration time"
     *                 ),
     *                 example={
     *                     "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     *                     "expiresAt": "2021-10-06T00:51:10+02:00"
     *                 }
     *             )
     *         )
     *     }
     * )
     * @OA\Response(
     *     response=401,
     *     description="Invalid credentials",
     * )
     * @OA\RequestBody(
     *     @OA\MediaType(mediaType="application/json",
     *          @OA\Schema(
     *              @OA\Property(property="username", type="string"),
     *              @OA\Property(property="password", type="string"),
     *              required={"username", "password"}
     *          )
    )
     * )
     * @OA\Tag(name="users")
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
