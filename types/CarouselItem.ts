import type { IReviewCardContent, IServiceCardContent } from "./CardContent";

export type CarouselItem =
  | { type: 'service'; data: IServiceCardContent }
  | { type: 'review'; data: IReviewCardContent }