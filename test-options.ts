import {test as base} from '@playwright/test'
import {PageManager} from './page-objects/pageManager'

export type TestOptions = {
    qlobalQaURL: string,
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    qlobalQaURL: ['', {option: true}],

    formLayoutsPage: [async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('') // use is a callback function that allows us to use the value of the fixture in the test
    }, {auto:true}], // auto: true means that the fixture will be automatically used in the test without having to specify it in the test function 

    pageManager: async({page}, use) => { 
        const pm = new PageManager(page)
        //!!!HERE, before use() WE CAN ADD SETUP actions
        await use(pm)
        //!!!HERE, after use() WE CAN ADD TEAR DOWN actions
    }
    
    //we can create dependencies between fixtures by using the value of one fixture in another fixture. For example, we can use the value of the page fixture in the pageManager fixture to create a new instance of the PageManager class.
    /*
     pageManager: async({page, formLayoutsPage}, use) => { 
        const pm = new PageManager(page)
        await use(pm)
    }
        //in this case pageMaanager triggers formLayoutsPage fixture. And formLayoutsPage will be executed 1st, before pageManager
    */
})