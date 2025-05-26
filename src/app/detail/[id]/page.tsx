
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

  if (!conferenceId) return <p>Invalid conference ID.</p>;
  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-error">Error: {error.message}</div>;

  const conference = data?.conference;
  if (!conference) return <div className="detail-error">Conference not found.</div>;

  const location = conference.locations?.[0];

  return (
    <div className="conference-detail-page">
      <button
        className="back-button"
        onClick={() => router.back()}
        aria-label="Back"
      >
        ← Back
      </button>
      <div className="conference-header">
        {location?.image?.url && (
          <img
            src={location.image.url}
            alt={location.image.title || conference.name}
            className="conference-image"
          />
        )}
        <div className="conference-header-text">
          <h1 className="conference-title">{conference.name}</h1>
          <p className="conference-slogan">{conference.slogan}</p>
          <div className="conference-dates">
            <strong>Dates:</strong>{" "}
            {conference.startDate} – {conference.endDate}
          </div>
          <div className="conference-venue">
            <strong>Venue:</strong> {location?.name || "N/A"}
          </div>
          <div className="conference-city-country">
            <strong>City:</strong> {location?.city || "N/A"},{" "}
            <strong>Country:</strong> {location?.country?.name || "N/A"}
          </div>
        </div>
      </div>
      <div className="conference-section">
        <h2>Organizer</h2>
        <div className="organizer-info">
          {conference.organizer?.image?.url && (
            <img
              src={conference.organizer.image.url}
              alt={conference.organizer.image.title || conference.organizer.name}
              className="organizer-image"
            />
          )}
          <div>
            <div><strong>Name:</strong> {conference.organizer?.name}</div>
            <div><strong>Company:</strong> {conference.organizer?.company}</div>
            {conference.organizer?.social?.youtube && (
              <div>
                <a
                  href={conference.organizer.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube Channel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {conference.series && (
        <div className="conference-section">
          <h2>Series</h2>
          <div>
            <div><strong>Name:</strong> {conference.series.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
