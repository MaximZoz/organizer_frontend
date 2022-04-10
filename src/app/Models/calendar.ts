export interface Week {
  days: Day[];
}

export interface Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
  quantityCompleted: number;
  quantityNoCompleted: number;
}
