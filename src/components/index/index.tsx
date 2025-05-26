import "./index.scss";
import Card from "../card/card";

export default function Index() {
  return (
    <div>
        <div className="container">
          <div className="row">
            <div className="col-4">
              <Card />
            </div>
            <div className="col-4">
              <Card />
            </div>
            <div className="col-4">
              <Card />
            </div>
          </div>
        </div>
    </div>
  );
}
