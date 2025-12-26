import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const village = searchParams.get('village');
    const tribalGroup = searchParams.get('tribalGroup');
    const boundaryType = searchParams.get('type') || 'all';

    // Build filter conditions
    const where: Prisma.BoundaryWhereInput = {};

    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    if (district) {
      where.district = { contains: district, mode: 'insensitive' };
    }

    if (village) {
      where.village = { contains: village, mode: 'insensitive' };
    }

    if (tribalGroup) {
      where.tribalGroup = { contains: tribalGroup, mode: 'insensitive' };
    }

    if (boundaryType !== 'all') {
      where.boundaryType = boundaryType;
    }

    // Fetch records from database
    const boundaries = await prisma.boundary.findMany({
      where
    });

    // If no records found, return appropriate response
    if (boundaries.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No boundary data found for the specified criteria',
        filters: {
          state: state || null,
          district: district || null,
          village: village || null,
          tribalGroup: tribalGroup || null,
          boundaryType: boundaryType
        }
      });
    }

    // Return GeoJSON FeatureCollection
    const geojsonResponse = {
      type: 'FeatureCollection',
      features: boundaries.map(boundary => boundary.geojson)
    };

    return NextResponse.json({
      success: true,
      data: geojsonResponse,
      boundaries: boundaries.map(boundary => ({
        id: boundary.id,
        name: (boundary.geojson as any).properties?.name,
        type: boundary.boundaryType,
        center: boundary.center,
        bbox: boundary.bbox
      })),
      total: boundaries.length,
      message: `Found ${boundaries.length} boundary records`
    });

  } catch (error) {
    console.error('Error fetching boundary data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch boundary data',
        message: 'An error occurred while retrieving geographical boundaries'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for uploading boundary data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, district, village, tribalGroup, boundaryType, geojson } = body;

    if (!state || !district || !geojson) {
      return NextResponse.json(
        { error: 'Missing required fields: state, district, geojson' },
        { status: 400 }
      );
    }

    // Calculate center and bounding box from GeoJSON
    const coordinates = geojson.geometry.coordinates[0];
    let minLat = coordinates[0][1];
    let maxLat = coordinates[0][1];
    let minLng = coordinates[0][0];
    let maxLng = coordinates[0][0];

    coordinates.forEach((coord: number[]) => {
      minLat = Math.min(minLat, coord[1]);
      maxLat = Math.max(maxLat, coord[1]);
      minLng = Math.min(minLng, coord[0]);
      maxLng = Math.max(maxLng, coord[0]);
    });

    const center = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    };

    const bbox = {
      north: maxLat,
      south: minLat,
      east: maxLng,
      west: minLng
    };

    const newBoundary = await prisma.boundary.create({
      data: {
        state,
        district,
        village: village || null,
        tribalGroup: tribalGroup || null,
        boundaryType: boundaryType || 'village',
        geojson,
        center,
        bbox
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Boundary data uploaded successfully',
      data: {
        id: newBoundary.id,
        name: geojson.properties?.name || `${village} ${boundaryType}`,
        type: boundaryType,
        center: newBoundary.center,
        bbox: newBoundary.bbox
      }
    });

  } catch (error) {
    console.error('Error uploading boundary data:', error);
    return NextResponse.json(
      { error: 'Failed to upload boundary data' },
      { status: 500 }
    );
  }
}


