import "./card.scss";

export default function Card() {
  return (
    <div className="card">
        <div className="card-header">
            <h2 className="card-title">Card Title</h2>
        </div>
        <div className="card-body">
            <span className="card-date">Date</span>
            <div className="card-location">Location</div>
            <div className="card-slogan">Slogan</div>
        </div>
        <div className="card-footer">
            <button className="btn btn-primary">View</button>
        </div>
    </div>
  );
}
