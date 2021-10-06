<?php

namespace App\Controller;

use App\Entity\Place;
use App\Entity\Visit;
use App\Utils\GeoTools;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @IsGranted("ROLE_USER")
 */
class PlaceController extends AbstractController
{
    /**
     * @Route("/places", name="places_list", methods={"GET"})
     */
    public function list(EntityManagerInterface $em): Response
    {
        return $this->json($em->getRepository(Place::class)->findAll());
    }

    /**
     * @Route("/places", name="places_create", methods={"POST"})
     */
    public function create(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $normalizer): Response
    {
        $place = $normalizer->denormalize($request->toArray(), Place::class);
        $errors = $validator->validate($place);

        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $em->persist($place);
        $em->flush();
        return $this->json($place, Response::HTTP_CREATED);
    }

    /**
     * @Route("/places/{id}", name="places_show", methods={"GET"})
     */
    public function show(Place $place): Response
    {
        return $this->json($place);
    }

    /**
     * @Route("/places/{id}/history", name="places_visitor_history", methods={"GET"})
     */
    public function history(Place $place, Request $request, GeoTools $geoTools, EntityManagerInterface $em): Response
    {
        $latitude = $request->query->get('latitude');
        $longitude = $request->query->get('longitude');
        $distance = $geoTools->calculateDistance($latitude, $longitude, $place->getLatitude(), $place->getLongitude());
        $visitorPostcode = $geoTools->findAddressByCoordinates($latitude, $longitude)['postcode'];
        $visits = $visitorPostcode ? $em->getRepository(Visit::class)->findAllByVisitorAndPostcode($this->getUser(), $visitorPostcode) : [];
        return $this->json([
            'place' => $place,
            'distance' => $distance,
            'visits' => $visits,
        ]);
    }
}
