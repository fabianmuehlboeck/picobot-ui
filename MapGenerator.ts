interface IMapGenerator<M extends IMap> {
    getStandardMap(): M;
    getTestMaps(): M[];
}

abstract class AMapGenerator<M extends IMap> implements IMapGenerator<M> {
    abstract getStandardMap(): M;
    getTestMaps(): M[] {
        return [this.getStandardMap()];
    }
}