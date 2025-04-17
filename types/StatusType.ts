export const PENDING_REVIEW = "Pending Review" as const;
export const UNDER_REVIEW = "Under Review" as const;
export const APPROVED_STATUS = "Approved" as const;
export const REJECTED_STATUS = "Rejected" as const;

export const ALL_STATUSES = [
  PENDING_REVIEW,
  UNDER_REVIEW,
  APPROVED_STATUS,
  REJECTED_STATUS,
];

type StatusType = (typeof ALL_STATUSES)[number];

export default StatusType;
