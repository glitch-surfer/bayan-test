import './styles/track.scss';
import { getCars } from '../../../utils/api/get-cars';
import { BaseComponent } from '../../../utils/base-component';
import { Car } from './car/car';
import type { ITrack } from './types/track-types';
import { clearElement } from '../../../utils/clear-element';
import { setCount } from '../../../utils/set-count';
import { Titles } from '../../../enums/titles';
import { Numbers } from '../../../enums/numbers';
import { trackView } from './view/track-view';
import { Pagination } from '../../pagination/pagination';

export class Track extends BaseComponent implements ITrack {
  public carsInGarage: Car[] = [];

  public carsOnPage: Car[] = [];

  constructor(
    public title: HTMLElement = new BaseComponent(trackView.title).getElement(),
    public subtitle: HTMLElement = new BaseComponent(trackView.subtitle).getElement(),
    public trackList: HTMLElement = new BaseComponent(trackView.trackList).getElement(),
    public pagination = new Pagination(),
  ) {
    super(trackView.wrapper);

    this.fillTrackList()
      .catch(() => {
        this.trackList.textContent = 'no cars in garage';
        Error('no cars');
      });

    this.getElement().append(
      this.title,
      this.subtitle,
      this.trackList,
      this.pagination.getElement(),
    );

    this.addPaginationHandler();
    document.addEventListener('updateTrack', this.updateTrackHandler.bind(this));
    document.addEventListener('startRace', this.startRaceHandler.bind(this));
    document.addEventListener('resetRace', this.resetRaceHandler.bind(this));
  }

  public async fillTrackList(): Promise<void> {
    const cars = await getCars();
    this.carsInGarage = [];

    cars.forEach((car) => {
      const newCar = new Car(car);
      this.carsInGarage.push(newCar);
    });
    this.title.textContent = setCount(Titles.GARAGE, this.carsInGarage);
    this.renderTrack(this.pagination.currentPage);
  }

  public renderTrack(page: number): void {
    const carsOnPage = Numbers.CARS_ON_PAGE;

    clearElement(this.trackList);
    this.carsOnPage = [];
    for (let i = (page * carsOnPage) - carsOnPage; i < (page * carsOnPage); i += 1) {
      if (this.carsInGarage[i] === undefined) break;
      this.trackList.append(this.carsInGarage[i].getElement());
      this.carsOnPage.push(this.carsInGarage[i]);
    }
  }

  private addPaginationHandler(): void {
    const paginationNextHandler = (): void => {
      if (
        this.pagination.currentPage < Math.ceil(this.carsInGarage.length / Numbers.CARS_ON_PAGE)
      ) {
        this.pagination.currentPage += 1;
        this.renderTrack(this.pagination.currentPage);
        this.subtitle.textContent = this.pagination.setPage();
      }
    };
    this.pagination.nextBtn.addEventListener('click', paginationNextHandler);

    const paginationPrevHandler = (): void => {
      if (this.pagination.currentPage > 1) {
        this.pagination.currentPage -= 1;
        this.renderTrack(this.pagination.currentPage);
        this.subtitle.textContent = this.pagination.setPage();
      }
    };
    this.pagination.prevBtn.addEventListener('click', paginationPrevHandler);
  }

  private updateTrackHandler(): void {
    this.fillTrackList()
      .catch(() => {
        this.trackList.textContent = 'no cars in garage';
        Error('no cars');
      });
  }

  private startRaceHandler(): void {
    this.carsOnPage.forEach((car) => {
      car.startBtn.click();
    });
  }

  private resetRaceHandler(): void {
    const drivedCars = this.carsInGarage.filter((car) => car.animation !== null);
    drivedCars.forEach((car) => {
      car.stopBtn.click();
    });
  }
}
