import noImg from "../../assets/img/Error-bro.png";

export default function NoData() {
  return (
    <div className="noData">
      <div className="flex_404">
        <figure className="img_404">
          <img src={noImg} alt="no data..." />
        </figure>
      </div>
    </div>
  );
}
