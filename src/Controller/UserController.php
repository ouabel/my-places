<?php

namespace App\Controller;

use App\Entity\Place;
use App\Entity\User;
use App\Entity\Visit;
use App\Event\VisitLogEvent;
use App\Utils\GeoTools;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class UserController extends AbstractController
{

    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $normalizer, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = $normalizer->denormalize($request->toArray(), User::class);
        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $user->getPassword()));

        $em->persist($user);
        $em->flush();
        return $this->json($user, Response::HTTP_CREATED, [], ['groups' => 'user-created']);
    }

    /**
     * @Route("/me", name="me", methods={"GET"})
     * @IsGranted("ROLE_USER")
     */
    public function me(): Response
    {
        return $this->json($this->getUser(), Response::HTTP_OK, [], ['groups' => 'user-me']);
    }

    /**
     * @Route("/position", name="position", methods={"GET"})
     * @IsGranted("ROLE_USER")
     */
    public function position(Request $request, EventDispatcherInterface $dispatcher, GeoTools $geoTools, EntityManagerInterface $em)
    {
        $latitude = $request->query->get('latitude');
        $longitude = $request->query->get('longitude');
        $address = $geoTools->findAddressByCoordinates($latitude, $longitude);
        $visit = new Visit($this->getUser(), $latitude, $longitude, $address['postcode'], $address['label'], $address['city']);
        $event = new VisitLogEvent($visit);
        $place = $em->getRepository(Place::class)->findOneBy(['postcode' => $address['postcode']]);

        $dispatcher->dispatch($event);

        return $this->json([
            'address' => $address,
            'place' => $place,
        ]);
    }

    /**
     * @Route("/history", name="history", methods={"GET"})
     * @IsGranted("ROLE_USER")
     */
    public function history(EntityManagerInterface $em)
    {
        $visits = $em->getRepository(Visit::class)->findFirstAndLastByVisitor($this->getUser());
        return $this->json($visits);
    }
}
