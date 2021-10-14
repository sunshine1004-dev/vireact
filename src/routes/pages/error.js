import React, { Component, Fragment } from "react";
// import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardTitle,Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "Components/CustomBootstrap";

class Error404 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.body.classList.add("background");
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }
  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="8" className="mx-auto my-auto">
                <Card className="py-5 d-flex align-items-center justify-content-center">
                  {/* <div className="position-relative image-side ">
                    <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
                    <p className="white mb-0">Yes, it is indeed!</p>
                  </div> */}
                  <div className="form-side py-3 my-5">
                    <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink>
                    {/* <CardTitle className="mb-4">
                      <label>Ooops... looks like an error occurred!</label>
                    </CardTitle> */}
                    <p className="mb-0 text-center text-muted text-small mb-0">
                      <label>Error code</label>
                    </p>
                    <p className="display-1 font-weight-bold mb-5">404</p>
                    <Button
                      href="/login"
                      color="primary"
                      className="pb-0 btn-shadow"
                      size="lg"
                    >
                      <label>GO BACK HOME</label>
                    </Button>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}
export default Error404;
