/**
 * svg外层的容器，负责处理层级/鼠标/画布大小/监控等事情
 */
class Container {
    name: string;
    element: HTMLElement | null;
    constructor() {
        this.name = 'svg-watermark'; // 容器名称
        this.element = null;
    }

    /**
     * 创建container
     * @returns 
     */
    create() {
        this.element = document.createElement('div');
        this.element.className = this.name;
        this.element.style.position = 'absolute';
        this.element.style.top = '0px';
        this.element.style.left = '0px';
        this.element.style.right = '0px';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '99999';
        this.element.style.overflow = 'hidden';
        this.element.style.height = '100%';

        return this.element;
    }

    /**
     * 添加svg
     */
    appendChild(svg: SVGElement) {
        this.remove();
        return this.element?.appendChild(svg);
    }

    /**
     * 移除容器
     */
    remove() {
        return this.element?.remove();
    }
}

export default new Container();