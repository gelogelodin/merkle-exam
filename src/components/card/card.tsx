import moment from 'moment';
import "./card.scss";

export default function Card({conference}: any) {

  function formateDate(date:Date){
    return moment(date).format('LL');
  }

  return (
    <div className="card">
        <div className="card-header">
            <h2 className="card-title">{ conference.name }</h2>
        </div>
        <div className="card-body">
            <img className='card-image' src={conference.organizer.image.url} />
            <span className="card-slogan">{ conference.slogan }</span>
            <span className="card-date">{ formateDate(conference.startDate) } - { formateDate(conference.endDate) }</span>
            <div className="card-location">{ conference.locations.length ? conference.locations[0].address + ', ' + conference.locations[0].country.name : null }</div>
        </div>
        <div className="card-footer">
            <a href={'detail/' + conference.id} className="btn btn-primary">View Details</a>
        </div>
    </div>
  );
}
