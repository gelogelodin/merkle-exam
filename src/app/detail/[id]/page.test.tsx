import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import ConferenceDetailPage from "./page";
import { useParams } from "next/navigation";
import { gql } from "@apollo/client";

// Mock useRouter to avoid navigation errors
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    back: jest.fn(),
  }),
  useParams: jest.fn(),
}));

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

const mockConference = {
  name: "React Finland 2024",
  slogan: "The best React conference in Finland",
  startDate: "2024-09-01",
  endDate: "2024-09-03",
  series: { name: "React Finland Series" },
  locations: [
    {
      name: "Helsinki Hall",
      address: "Main St 1",
      city: "Helsinki",
      country: { code: "FI", name: "Finland" },
      image: {
        title: "Venue Image",
        url: "https://example.com/image.jpg",
      },
    },
  ],
  organizer: {
    name: "React Finland Org",
    company: "React Finland Ltd",
    social: { youtube: "https://youtube.com/reactfinland" },
    image: {
      title: "Organizer Image",
      url: "https://example.com/org.jpg",
    },
  },
};

const mocks = [
  {
    request: {
      query: CONFERENCE_QUERY,
      variables: { conferenceId: "1" },
    },
    result: {
      data: {
        conference: mockConference,
      },
    },
  },
  {
    request: {
      query: CONFERENCE_QUERY,
      variables: { conferenceId: "404" },
    },
    result: {
      data: {
        conference: null,
      },
    },
  },
];

describe("ConferenceDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders invalid conference ID", () => {
    (useParams as jest.Mock).mockReturnValue({});
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConferenceDetailPage />
      </MockedProvider>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid conference ID.");
  });

  it("renders loading state", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConferenceDetailPage />
      </MockedProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("renders error state", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    const errorMocks = [
      {
        request: {
          query: CONFERENCE_QUERY,
          variables: { conferenceId: "1" },
        },
        error: new Error("Network error"),
      },
    ];
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <ConferenceDetailPage />
      </MockedProvider>
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Error: Network error")
    );
  });

  it("renders conference not found", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "404" });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConferenceDetailPage />
      </MockedProvider>
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Conference not found.")
    );
  });
});