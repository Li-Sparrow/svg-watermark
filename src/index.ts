/**
 * svg水印服务
 */
import { IWatermarkInfo } from './interface';
import container from './container';
import svgCreator from './svg';
export default class SvgWatermark {
    observer: MutationObserver | null;
    constructor() {
        this.observer = null;
    }

    /**
     * 绘制水印到全文区域
     * @param watermarkInfo 
     * @returns 
     */
    render(watermarkInfo: IWatermarkInfo) {
        if (!watermarkInfo.value) {
            throw new Error('Watermark Params Error');
        }

        const containerEle = container.create();

        // 获取svg背景图
        const svg = this.createSVG(watermarkInfo);
        // 添加到全局元素上
        containerEle.appendChild(svg);

        // 默认添加到body上
        const parentElement = watermarkInfo.selector ? document.querySelector(watermarkInfo.selector) : document.body

        if (!parentElement) {
            console.error('can not find a valid container to render watermark');
            return false;
        }

        parentElement.appendChild(containerEle);

        this.bindObserve(containerEle, () => {
            // 如果节点还存在于视图上就卸载掉
            if (document.documentElement.contains(containerEle)) {
                parentElement.removeChild(containerEle)
                container.remove();
            }

            // 重新渲染
            this.render(watermarkInfo);
        })

        return true;
    }

    /**
    * 监听元素的修改、删除
    * @param {*} element 监听的元素
    * @param {*} callback 发生修改、删除时的回调
    */
    private bindObserve(element: HTMLElement, callback: Function) {
        this.observer && this.observer.disconnect();
        // 避免用户手动修改
        this.observer = new MutationObserver((mutationRecords) => {
            if (mutationRecords && mutationRecords.length) {
                const result = mutationRecords.some(record => {
                    return element.contains(record.target)
                });

                if (result) {
                    callback(mutationRecords);
                }

            }
        });
        this.observer.observe(element, { childList: true, subtree: true, characterData: true, attributes: true });
    }

    /**
     * 创建svg
     * @param {*} watermarkInfo 
     * @returns 
     */
    createSVG(watermarkInfo: IWatermarkInfo) {
        return svgCreator.create(watermarkInfo);
    }

    /**
     * 清除
     */
    clear() {
        return container.remove();
    }
}