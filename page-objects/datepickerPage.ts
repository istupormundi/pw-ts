import {Page, expect} from '@playwright/test'

export class DatepickerPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async selcetCommonDatepickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)

        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRange(startDate: number, endDay: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const startDateToAssert = await this.selectDateInCalendar(startDate)
        const endDateToAssert = await this.selectDateInCalendar(endDay)
        const dateToAssert =  `${startDateToAssert} - ${endDateToAssert}` 
        
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number){

        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleDateString('En-US', {month:'short'})
        const expectedMothLong = date.toLocaleDateString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMothLong} ${expectedYear} `

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('.ng-star-inserted').getByText(expectedDate, {exact: true}).click()

        return dateToAssert
    }
}