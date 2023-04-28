import React from "react";

interface PageNotFoundProps {}

const PageNotFound: React.FC<PageNotFoundProps> = (
  props: PageNotFoundProps
): JSX.Element => {
  return (
    // <Layout {...props}>
    //   <Helmet
    //     title="Page not found"
    //     meta={[{ property: "og:title", content: "Page not found" }]}
    //   />
    //   <div>
    //     <h1>Page not found</h1>
    //   </div>
    // </Layout>
    <>Not found</>
  );
};

export default PageNotFound;
