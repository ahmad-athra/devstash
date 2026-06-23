import React from 'react';
import ItemTypeClient from './ItemTypeClient';

interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function ItemTypePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ItemTypeClient typeParam={resolvedParams.type} />;
}
