import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tables',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tables.component.html',
    styleUrls: ['tables.component.scss'],
})
export class TablesComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
