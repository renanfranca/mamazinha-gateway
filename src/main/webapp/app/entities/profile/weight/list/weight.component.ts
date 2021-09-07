import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWeight } from '../weight.model';
import { WeightService } from '../service/weight.service';
import { WeightDeleteDialogComponent } from '../delete/weight-delete-dialog.component';

@Component({
  selector: 'jhi-weight',
  templateUrl: './weight.component.html',
})
export class WeightComponent implements OnInit {
  weights?: IWeight[];
  isLoading = false;

  constructor(protected weightService: WeightService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.weightService.query().subscribe(
      (res: HttpResponse<IWeight[]>) => {
        this.isLoading = false;
        this.weights = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWeight): number {
    return item.id!;
  }

  delete(weight: IWeight): void {
    const modalRef = this.modalService.open(WeightDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.weight = weight;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
