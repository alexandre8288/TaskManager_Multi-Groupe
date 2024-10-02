import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleTagComponent } from './circle-tag.component';

describe('CircleTagComponent', () => {
  let component: CircleTagComponent;
  let fixture: ComponentFixture<CircleTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
