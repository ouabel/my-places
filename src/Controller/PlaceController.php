<?php

namespace App\Controller;

use App\Entity\Place;
use App\Entity\Visit;
use App\Utils\GeoTools;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Annotations as OA;
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
     * Places' list
     *
     * Get the full list of registered places
     *
     * @Route("/places", name="places_list", methods={"GET"})
     * @OA\Response(
     *     response=200,
     *     description="Returns the list of registred places",
     *     @OA\JsonContent(
     *        type="array",
     *        @OA\Items(ref=@Model(type=Place::class))
     *     )
     * )
     * @OA\Tag(name="places")
     * @Security(name="Bearer")
     */
    public function list(EntityManagerInterface $em): Response
    {
        return $this->json($em->getRepository(Place::class)->findAll());
    }

    /**
     * Create place
     *
     * Create a new place
     *
     * @Route("/places", name="places_create", methods={"POST"})
     * @OA\Tag(name="places")
     * @Security(name="Bearer")
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
     * Show place
     *
     * show a single place details
     *
     * @Route("/places/{id}", name="places_show", methods={"GET"})
     * @OA\Tag(name="places")
     * @Security(name="Bearer")
     */
    public function show(Place $place): Response
    {
        return $this->json($place);
    }

    /**
     * User history in a place
     *
     * Get the user's history in a specific place
     *
     * @Route("/places/{id}/history", name="places_visitor_history", methods={"GET"})
     * @OA\Tag(name="places")
     * @Security(name="Bearer")
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
