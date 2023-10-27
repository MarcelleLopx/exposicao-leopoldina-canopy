import { CanopyEnvironment } from "@customTypes/canopy";
import Container from "@components/Shared/Container";
import FACETS from "@.canopy/facets.json";
import Heading from "../components/Shared/Heading/Heading";
import Hero from "@components/Hero/Hero";
import { HeroWrapper } from "../components/Hero/Hero.styled";
import Layout from "@components/layout";
import { LocaleString } from "@hooks/useLocale";
import React from "react";
import Related from "../components/Related/Related";
import { canopyManifests } from "@lib/constants/canopy";
import { createCollection } from "../lib/iiif/constructors/collection";
import { getRelatedFacetValue } from "../lib/iiif/constructors/related";
import { useCanopyState } from "@context/canopy";

interface IndexProps {
  featuredItem: any;
  collections: string[];
}

const Index: React.FC<IndexProps> = ({ featuredItem, collections }) => {
  const { canopyState } = useCanopyState();
  const {
    config: { baseUrl },
  } = canopyState;

  const hero = {
    ...featuredItem,
    items: featuredItem.items.map((item: any) => {
      return {
        ...item,
        homepage: [
          {
            id: `${baseUrl}/works/`,
            type: "Text",
            label: item.label,
          },
        ],
      };
    }),
  };

  return (
    <Layout>
      <HeroWrapper>
        <Hero collection={hero} />
      </HeroWrapper>
      <Container>
        <Heading as="h2">Sobre a exposição</Heading>
        <div>
          <p>
          A partir da representação da personagem histórica de Maria Leopoldina da
Áustria na telenovela de época Novo Mundo (2017), buscamos analisar referências presentes 
em seu figurino em obras imagéticas e historiográficas que retratam a figura da Princesa 
na História do Brasil Imperial. A partir da análise do traje de cena buscamos demonstrar 
como os figurinos históricos podem oferecer contribuições para a disseminação de conhecimento 
histórico, transmitindo memórias culturais e midiáticas para o telespectador brasileiro.
          <br />- Para mais informações sobre a novela, acesse{" "}
          <a href="https://memoriaglobo.globo.com/entretenimento/novelas/novo-mundo/">
          Memória Globo
          </a>.
          </p>
        </div>
        <Related
          collections={collections}
          title={LocaleString("homepageHighlightedWorks")}
        />
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const manifests = canopyManifests();

  // @ts-ignore
  const { featured, metadata, baseUrl } = process.env
    ?.CANOPY_CONFIG as unknown as CanopyEnvironment;

  const randomFeaturedItem =
    manifests[Math.floor(Math.random() * manifests.length)];
  const featuredItem = await createCollection(
    featured ? featured : [randomFeaturedItem.id]
  );

  const collections = FACETS.map((facet) => {
    const value = getRelatedFacetValue(facet.label);
    return `${baseUrl}/api/facet/${facet.slug}/${value.slug}.json?sort=random`;
  });

  return {
    props: { metadata, featuredItem, collections },
    revalidate: 3600,
  };
}

export default Index;
