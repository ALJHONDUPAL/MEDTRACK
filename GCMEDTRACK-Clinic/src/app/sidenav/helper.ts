import { animate, style, transition, trigger } from "@angular/animations";

export interface INavbarData {
    routeLink: string;
    icon?: string;
    label: string;
    expanded?: boolean;
    items?: INavbarData[];
}

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('350ms',
        style({opacity: 1})
      )
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('350ms',
        style({opacity: 0})
      )
    ])
]);

export const rotate = trigger('rotate', [
    transition(':enter', [
        animate('1000ms', 
            style({ transform: 'rotate(180deg)' })
        )
    ]),
    transition(':leave', [
        animate('1000ms',
            style({ transform: 'rotate(0deg)' })
        )
    ])
]);