import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagDatabaseComponent } from './rag-database.component';

describe('RagDatabaseComponent', () => {
  let component: RagDatabaseComponent;
  let fixture: ComponentFixture<RagDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RagDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
