import { Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class NavigationPage extends HelperBase{
    //и это тоже больше не нужно с хелпером
    //readonly page: Page
    readonly formLayoutsMenuItem: Locator

    //тут конфликт с пейдж от хелпера будет, если пистаь this.page = page
    constructor(page: Page) {
        super(page)
        //рекомендуют выносить локаторы отдельно из методов, но это отстой полный
        //в конструкторе и в переменных выше насобирается куча ерунды. Тупо так делать
        this.formLayoutsMenuItem = page.getByText('Form Layouts') 
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    async ioTDashboard(){
        await this.page.getByText('IoT Dashboard').click()
    }

    //меню может быть уже открыто и +1 клик его закроет и дальше тесты сфейлят
    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')

        if (expandedState == "false"){
            await groupMenuItem.click()
        }
    }
}