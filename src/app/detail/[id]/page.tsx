'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import "./detail.scss";

const CONFERENCE_QUERY = gql`
  query ConferenceQuery($conferenceId: ID!) {
    conference(id: $conferenceId) {
      name
      slogan
      startDate
      endDate
      series {
        name
      }
      locations {
        name
        address
        city
        country {
          code
          name
        }
        image {
          title
          url
        }
      }
      organizer {
        name
        company
        social {
          youtube
        }
        image {
          title
          url
        }
      }
    }
  }
`;

export default function ConferenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const conferenceId = params?.id;

  const { loading, error, data } = useQuery(CONFERENCE_QUERY, {
    variables: { conferenceId },
    skip: !conferenceId,
  });

  if (!conferenceId)
    return (
      <main role="main" tabIndex={-1}>
        <p role="alert">Invalid conference ID.</p>
      </main>
    );
  if (loading)
    return (
      <main role="main" tabIndex={-1}>
        <div className="detail-loading" role="status" aria-live="polite">
          Loading...
        </div>
      </main>
    );
  if (error)
    return (
      <main role="main" tabIndex={-1}>
        <div className="detail-error" role="alert">
          Error: {error.message}
        </div>
      </main>
    );

  const conference = data?.conference;
  if (!conference)
    return (
      <main role="main" tabIndex={-1}>
        <div className="detail-error" role="alert">
          Conference not found.
        </div>
      </main>
    );

  const location = conference.locations?.[0];

  return (
    <main className="conference-detail-page" role="main" tabIndex={-1}>
      <header className="conference-header" role="banner">
        <button
          className="back-button"
          onClick={() => router.back()}
          aria-label="Go back to previous page"
          title="Go back"
        >
          ← Back
        </button>
        {location?.image?.url && (
          <img
            src={location.image.url}
            alt={
              location.image.title
                ? `${location.image.title} - ${conference.name}`
                : conference.name
            }
            className="conference-image"
          />
        )}
        <div className="conference-header-text">
          <h1 className="conference-title">{conference.name}</h1>
          {conference.slogan && (
            <p className="conference-slogan">{conference.slogan}</p>
          )}
          <div className="conference-dates">
            <strong>Dates:</strong> {conference.startDate} – {conference.endDate}
          </div>
          <div className="conference-venue">
            <strong>Venue:</strong> {location?.name || "N/A"}
          </div>
          <div className="conference-city-country">
            <strong>City:</strong> {location?.city || "N/A"},{" "}
            <strong>Country:</strong> {location?.country?.name || "N/A"}
          </div>
        </div>
      </header>
      <section className="conference-section" aria-labelledby="organizer-heading">
        <h2 id="organizer-heading">Organizer</h2>
        <div className="organizer-info">
          {conference.organizer?.image?.url && (
            <img
              src={conference.organizer.image.url}
              alt={
                conference.organizer.image.title
                  ? `${conference.organizer.image.title} - ${conference.organizer.name}`
                  : conference.organizer.name
              }
              className="organizer-image"
            />
          )}
          <div>
            <div>
              <strong>Name:</strong> {conference.organizer?.name}
            </div>
            <div>
              <strong>Company:</strong> {conference.organizer?.company}
            </div>
            {conference.organizer?.social?.youtube && (
              <div>
                <a
                  href={conference.organizer.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`YouTube Channel for ${conference.organizer?.name}`}
                >
                  YouTube Channel
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
      {conference.series && (
        <section className="conference-section" aria-labelledby="series-heading">
          <h2 id="series-heading">Series</h2>
          <div>
            <div>
              <strong>Name:</strong> {conference.series.name}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
