import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAppletComponent } from './chat-applet.component';

describe('ChatAppletComponent', () => {
  let component: ChatAppletComponent;
  let fixture: ComponentFixture<ChatAppletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatAppletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAppletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
