import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagWebComponent } from './rag-web.component';

describe('RagWebComponent', () => {
  let component: RagWebComponent;
  let fixture: ComponentFixture<RagWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RagWebComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
