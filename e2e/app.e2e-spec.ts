import { CrackADraftPage } from './app.po';

describe('crack-a-draft App', () => {
  let page: CrackADraftPage;

  beforeEach(() => {
    page = new CrackADraftPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
