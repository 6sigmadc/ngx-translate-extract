class TranslateService {
    get(s: string) {return s};
}
export class MyComponent {
    public constructor(protected translateService: TranslateService) 
    {
        translateService.get('It works!');
    }
}