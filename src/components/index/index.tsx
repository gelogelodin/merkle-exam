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

  if (loading)
    return (
      <main role="main" tabIndex={-1}>
        <p role="status" aria-live="polite" className="loading-message">
          Loading conferences...
        </p>
      </main>
    );
  if (error)
    return (
      <main role="main" tabIndex={-1}>
        <p role="alert" className="error-message">
          Error loading conferences: {error.message}
        </p>
      </main>
    );

  function renderCards() {
    if (!data) return null;

    let sortedConferences = [...data.conferences].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return sortedConferences.map((item: any) => (
      <li key={item.id} className="col-4" tabIndex={-1} aria-label={`Conference: ${item.name}`}>
        <Card conference={item} />
      </li>
    ));
  }

  return (
    <main role="main" tabIndex={-1}>
      <div className="container">
        <h1 className="visually-hidden">Conference Explorer Application</h1>
        <section aria-labelledby="conference-list-heading">
          <h2 id="conference-list-heading">Upcoming Conferences</h2>
          <ul className="row" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {renderCards()}
          </ul>
        </section>
      </div>
    </main>
  );
}
