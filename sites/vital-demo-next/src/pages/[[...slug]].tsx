// import getStaticProps from '@bodiless/next/lib/getStaticProps';
// import getStaticPaths from '@bodiless/next/lib/getStaticPaths';
import PageRenderer from '@bodiless/next/lib/PageRenderer';
import _default from '../templates/_default';
import styleguide from '../templates/styleguide';

const Templates = {
  '_default.jsx': _default,
  'styleguide.jsx': styleguide,
};
type getServerSideProps = {
  params: {
    slug?: string[];
    redirect?: string;
  };
};
const getStaticProps = async ({ params }: getServerSideProps) => {
  let json = {};
  try {
    const data = await fetch(
      'https://bodiless-js-ohey.test.bluerev.co/api/data',
      {
        method: 'POST',
        body: JSON.stringify(params ?? ''),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    json = await data.json();
  } catch (error) {
    console.log('error', error);
  }

  return json;
};

const getStaticPaths = async ({ params }: getServerSideProps) => {
  const data = { paths: [], fallback: 'blocking' };
  return data;
};

export { getStaticProps, getStaticPaths };

const Page = ({ component, ...rest }: any) => {
  const DefaultPage = Templates[component] || _default;
  return PageRenderer({
    Component: DefaultPage,
    ...rest,
  });
};

export default Page;
