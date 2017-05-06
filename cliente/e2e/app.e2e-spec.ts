import { ClientePage } from './app.po';

describe('cliente App', () => {
  let page: ClientePage;

  beforeEach(() => {
    page = new ClientePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
