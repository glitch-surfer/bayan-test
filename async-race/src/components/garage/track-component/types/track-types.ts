import type { IParams } from '../../../../types/types';

export interface ITrack {
  title: HTMLElement
  subtitle: HTMLElement
  trackList: HTMLElement
}

export interface ITrackParams {
  wrapper: IParams
  title: IParams
  subtitle: IParams
  trackList: IParams
}
