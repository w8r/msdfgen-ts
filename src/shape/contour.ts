import { type EdgeSegment } from "./segments.js";

/**
 * A closed contour — an ordered sequence of edge segments.
 * The endpoint of segment[i] must equal the start of segment[i+1];
 * the endpoint of the last segment must equal the start of the first.
 */
export type Contour = EdgeSegment[];
