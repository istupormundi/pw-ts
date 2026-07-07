import {test, expect} from '@playwright/test'
import {NavigationPage} from '../page-objects/naviagationPage'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        const navigateTo = new NavigationPage(page)
        await navigateTo.formLayoutsPage()
        //await page.getByText('Forms').click()
        //await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        const inputEmail = page.locator('#inputEmail1')
        let exp = 'test2@test.com'

        await usingTheGridEmailInput.fill('test@test.com')
        await inputEmail.fill('dev@test.com')

        await inputEmail.clear()
        await inputEmail.pressSequentially(exp, {delay: 10}) //имитирует последовательное нажатие клавиш для каждого символа строки, 
        // как будто пользователь печатает текст вручную.

        //generic assertion
        const inputValue = await inputEmail.inputValue()
        expect(inputValue).toEqual(exp)

        //locator assertion
        await expect(inputEmail).toHaveValue(exp)
    })

    test.only('radio buttons', async({page}) => {
        //await page.locator('nb-radio :text-is("Option 1")').click()
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force: true}) //visually-hidden класс был
        //так задаем, чтобы плейврайт не проверял можно ли реально кликать по эл-ту, а просто поменял его состояние
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 100}) //сравнивает скриншот с эталонным, если его нет, то создаст новый

        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})


test('checkboxws', async({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.toastrPage()
    //await page.getByText('Modal & Overlays').click()
    //await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    // check()\uncheck() - проверит статус чекбокса, не сделает ему селект-анселект, ЕСЛИ чекбокс уже выделен!!
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})
    await page.getByRole('checkbox', {name: "Show toast with icon"}).uncheck({force: true})

    //(Un)Select all checkboxes
    //firstly we need locator for all checkboxes
    const allBoxes = page.getByRole('checkbox')

    //all() - сконвертит в лист эти элементы
    for(const box of await allBoxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }

})

test('list and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    //page.getByRole('list') //use when the list has UL tag
    //page.getByRole('listitem') //use when the list has LI tag

    //мы не можем просто так юзать. тк у нас структура такая
    // <ul>
    // <nb-option>
    //</ul>
    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')

    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    for(const color in colors){
        await dropDownMenu.click()
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
    }
})

test('tooltip', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    //page.getByRole('tooltip') //will work only you have role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()

    expect(tooltip).toEqual("This is a tooltip")
})

test('dialog  box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()

    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click() //playwright cancel this dialog box
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //how to get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder("Age").clear()
    await page.locator('input-editor').getByPlaceholder("Age").fill('44')
    await page.locator('.nb-checkmark').click()

    //select a row by id column
    //navigate to page 2
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    //there are 2 rows with 11, we should filter
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('aloha@gmail.com')
    await page.locator('.nb-checkmark').click()

    await expect(targetRowById.locator('td').nth(5)).toHaveText('aloha@gmail.com')

    //test filter of the table
    const ages = ["20", "30", "40", "100"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age) 
        //нужен таймаут, тк не сразу применится фильтр
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        //all() сделает массив всех элементов
        for (let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if(age == "100"){
                expect(cellValue).toEqual(" No data found ")
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }
            else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('date picker', async({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.datePickerPage()
    //await page.getByText('Forms').click()
    //await page.getByText('Datepicker').click()
    
    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    //тут можно прочитать больше про этот объект
    //https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date
    let date = new Date()
    date.setDate(date.getDate() + 14)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleDateString('En-US', {month:'short'})
    const expectedMothLong = date.toLocaleDateString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    //тут НЕ одинарная кавычка, а символ возле кнопки esc
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    //let потому что мы позже переиспользуем эту переменную
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMothLong} ${expectedYear} `

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    //await page.locator('.ng-star-inserted').getByText('14').click()
    //await page.locator('[class="day-cell ng-star-inserted"]').getByText('14').click()
    //getByText makes partial match
    await page.locator('.ng-star-inserted').getByText(expectedDate, {exact: true}).click()

    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    await page.getByText('IoT Dashboard').click()

    /*
    //Option 1: update slider attributes (coordinates)
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluateHandle( node => {
        node.setAttribute('cx', '231.223')
        node.setAttribute('cy', '231.223')
        //нужно, чтобы еще сам бар перетянулся, поэтому еще 1 клик на кружочек делаем
    })
    await tempGauge.click()
    */

    //Option2: change actual mouse movement
    //we need a locator, in which area should be moved our mouse
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    //scroll down a little bit to be sure that our whole box will be under\reacheable by the mouse
    await tempBox.scrollIntoViewIfNeeded()
    //define a bounding box
    //find box size, emmulate coordinate axes for this size
    //but we also go outside this bounding box
    const box = await tempBox.boundingBox()
    //define a center of the box and use it like our starting point
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y) // navigate to the location by mouse
    //mouse.down() Имитирует нажатие кнопки мыши в текущей позиции курсора. После вызова считается, что кнопка мыши удерживается нажатой
    await page.mouse.down()
    await page.mouse.move(x + 100, y) //move mouse to the right
    //сразу в (+100, +100) мы не можем походить, тк если так сделать, то бар не поедет вправо, а наоборот (см. это реально на сайте мышью как двигаешь, сразу станет ясно)
    await page.mouse.move(x + 100, y + 100) //move mouse down
    //mouse.up() Имитирует отпускание кнопки мыши.
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})