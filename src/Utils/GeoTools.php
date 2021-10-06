<?php


namespace App\Utils;


use Symfony\Contracts\HttpClient\HttpClientInterface;


class GeoTools
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    public function findAddressByCoordinates(string $latitude, string $longitude): ?array
    {
        $response = $this->client->request(
            'GET',
            'https://api-adresse.data.gouv.fr/reverse/',
            ['query' => ['lat' => $latitude, 'lon' => $longitude]]
        );

        $properties = $response->toArray()['features'][0]['properties'] ?? [];

        return [
            'label' => $properties['label'] ?? null,
            'city' => $properties['city'] ?? null,
            'postcode' => $properties['postcode'] ?? null,
        ];
    }

    public function calculateDistance(string $lat1, string $lon1, string $lat2, string $lon2, $earthRadius = 6371)
    {
        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
        return number_format((float)$angle * $earthRadius, 2, '.', '');
    }
}
