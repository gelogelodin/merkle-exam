import { useQuery, gql } from '@apollo/client';
import "./index.scss";
import Card from "../card/card";

const CONFERENCE_QUERY = gql`
  query ConferenceQuery {
    conferences {
      id
      name
      slogan
      locations {
        address
        city
        country {
          code
          name
        }
        image {
          style {
            backgroundSize
          }
          title
          url
        }
        name
      }
      startDate
      endDate
      organizer {
        company
        image {
          style {
            backgroundSize
          }
          title
          url
        }
      }
    }
  }
`;

export default function Index() {
  const { loading, error, data } = useQuery(CONFERENCE_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  function renderCards(){
    if (!data) return null;

    let sortedConferences = [...data.conferences].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    
    let cards = sortedConferences.map((item:any, index:number) => {
          return <div key={index} className='col-4'>
            <Card conference={item} />
          </div>
    });

    return cards;
  }
  
  return (
    <div>
          <div className="container">
            <div className="row">
              {  renderCards() }
            </div>
          </div>
    </div>
  );
}