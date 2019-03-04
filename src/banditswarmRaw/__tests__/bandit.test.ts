import { Network } from './../Network'
import { FullyConnectedLayer } from './../FullyConnectedLayer'

describe('BanditNetwork', () => {
    test('add layer', () => {
        const network = new Network()
        network.addLayer(new FullyConnectedLayer(4, 4, 16, n => n))
        network.addLayer(new FullyConnectedLayer(4, 7, 16, n => n))
        expect(network.forward([1,2,3,4]).length).toEqual(7)
    })

    test('add layer error', () => {
        const network = new Network()
        network.addLayer(new FullyConnectedLayer(4, 6, 16, n => n))
        expect(() => network.addLayer(new FullyConnectedLayer(4, 7, 16, n => n)))
            .toThrowError()
    })

})
