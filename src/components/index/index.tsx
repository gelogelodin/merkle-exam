import { useState } from "react";
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

type SortOption = "date" | "location";

export default function Index() {
  const { loading, error, data } = useQuery(CONFERENCE_QUERY);
  const [sortOption, setSortOption] = useState<SortOption>("date");

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

  function sortConferences(conferences: any[]) {
    if (sortOption === "date") {
      return [...conferences].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sortOption === "location") {
      return [...conferences].sort((a, b) => {
        const locA = a.locations?.[0]?.city?.toLowerCase() || "";
        const locB = b.locations?.[0]?.city?.toLowerCase() || "";
        return locA.localeCompare(locB);
      });
    }
    return conferences;
  }

  function renderCards() {
    if (!data) return null;
    
    const sortedConferences = sortConferences(data.conferences);
    
    return sortedConferences.map((item: any) => (
      <li key={item.id} className="col-4" tabIndex={-1} aria-label={`Conference: ${item.name}`}>
        <Card conference={item} />
      </li>
    ));
  }

  return (
    <main role="main" tabIndex={-1}>
      <div className="container">
        <h1>Conference Explorer Application</h1>
        <section aria-labelledby="conference-list-heading">
          <div className="sorting-controls" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="sort-select" style={{ marginRight: "0.5rem" }}>
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={e => setSortOption(e.target.value as SortOption)}
              aria-label="Sort conferences"
            >
              <option value="date">Date (Newest First)</option>
              <option value="location">Location (A-Z by City)</option>
            </select>
          </div>
          <h2 id="conference-list-heading">Upcoming Conferences</h2>
          <ul className="row" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {renderCards()}
          </ul>
        </section>
      </div>
    </main>
  );
}
