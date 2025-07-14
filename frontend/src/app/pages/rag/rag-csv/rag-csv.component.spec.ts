import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagCsvComponent } from './rag-csv.component';

describe('RagCsvComponent', () => {
  let component: RagCsvComponent;
  let fixture: ComponentFixture<RagCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RagCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
