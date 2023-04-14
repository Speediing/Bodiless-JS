import getStaticProps from '@bodiless/next/lib/getStaticProps';

type getServerSideProps = {
  params: {
    slug?: string[];
    redirect?: string;
  };
};
export default async function handler(req, res) {
  const data = await getStaticProps({ params: req.body });
  res.status(200).json(data);
}
