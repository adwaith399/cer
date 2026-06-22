import { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./assets/eram-logo.png";

import "./App.css";

function App() {
  const generateId = () =>
    "CRT-" + Math.floor(100000 + Math.random() * 900000);

  const emptyForm = {
    name: "",
    course: "",
    date: "",
    instructor: "",
    director: "",
    certificateType: "completion",
  };

  const [form, setForm] =
    useState(emptyForm);

  const [list, setList] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const [certificateId, setCertificateId] =
    useState(generateId());

  const content = {
    completion: [
      "CERTIFICATE",
      "OF COMPLETION",
      "For successfully completing the course",
    ],

    participation: [
      "CERTIFICATE",
      "OF PARTICIPATION",
      "For active participation in",
    ],

    achievement: [
      "CERTIFICATE",
      "OF ACHIEVEMENT",
      "For outstanding achievement in",
    ],

    excellence: [
      "CERTIFICATE",
      "OF EXCELLENCE",
      "In recognition of excellence in",
    ],

    training: [
      "TRAINING",
      "CERTIFICATE",
      "For successfully completing training in",
    ],
  };

  const [title, subtitle, text] =
    content[form.certificateType];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/certificates"
          );

        setList(res.data);

      } catch (err) {
        console.log(err);
      }
    };

  const change = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      [field]:
        field === "date" ||
        field ===
          "certificateType"
          ? value
          : value.toUpperCase(),
    }));
  };

  const save = async () => {
    try {
      await axios.post(
        "http://localhost:5000/certificates",
        {
          ...form,
          certificateId,
        }
      );

      await fetchCertificates();

      alert(
        "Saved ✅"
      );

    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (id) => {
    console.log("DELETE CLICKED:", id);

    try {
      const confirmDelete = window.confirm(
        "Delete this certificate?"
      );

      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/certificates/${id}`
      );

      setList((prev) =>
        prev.filter((x) => x._id !== id)
      );

      alert("Deleted ✅");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const update = async () => {
    try {
      if (!selected) {
        alert("Select certificate");
        return;
      }

      const res =
        await axios.put(
          `http://localhost:5000/certificates/${selected}`,
          {
            ...form,
            certificateId,
          }
        );

      setList((prev) =>
        prev.map((x) =>
          x._id === selected
            ? res.data.data
            : x
        )
      );

      alert(
        "Updated ✅"
      );

    } catch (err) {
      console.log(err);

      alert(
        "Update failed"
      );
    }
  };

  const select = (c) => {
    setSelected(c._id);

    setCertificateId(
      c.certificateId
    );

    setForm({
      name:
        c.name || "",

      course:
        c.course || "",

      date:
        c.date
          ? new Date(
              c.date
            )
              .toISOString()
              .split("T")[0]
          : "",

      instructor:
        c.instructor ||
        "",

      director:
        c.director ||
        "",

      certificateType:
        c.certificateType ||
        "completion",
    });
  };

  const download =
    async () => {
      if (
        !form.name ||
        !form.course ||
        !form.date
      ) {
        alert(
          "Fill all fields"
        );

        return;
      }

      if (
        !selected
      ) {
        await save();
      }

      const canvas =
        await html2canvas(
          document.querySelector(
            ".certificate"
          ),
          {
            scale: 2,
          }
        );

      const pdf =
        new jsPDF({
          orientation:
            "landscape",

          unit:
            "px",

          format: [
            canvas.width,
            canvas.height,
          ],
        });

      pdf.addImage(
        canvas.toDataURL(),
        "PNG",
        0,
        0
      );

      pdf.save(
        `${form.name}.pdf`
      );
    };

  const filtered =
    list.filter((x) =>
      x.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="container">

      <h1 className="page-title">
        Certificate Generator
      </h1>

      <div className="form">

        <select
          value={
            form.certificateType
          }
          onChange={(e)=>
            change(
              "certificateType",
              e.target.value
            )
          }
        >
          {Object.keys(content)
            .map((x)=>(
              <option key={x}>
                {x}
              </option>
            ))}
        </select>

        {[
          "name",
          "course",
          "date",
          "instructor",
          "director",
        ].map((f)=>(
          <input
            key={f}
            type={
              f==="date"
                ? "date"
                : "text"
            }

            value={
              form[f]
            }

            placeholder={
              f
            }

            onChange={(e)=>
              change(
                f,
                e.target.value
              )
            }
          />
        ))}

        <button
          type="button"
          onClick={download}
        >
          Download
        </button>

        <button
          type="button"
          onClick={update}
        >
          Update
        </button>

      </div>

      <input
        placeholder="Search"

        value={search}

        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="table-container">

        <table className="certificate-table">

          <thead>
            <tr>
              <th>Edit</th>
              <th>Name</th>
              <th>Course</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((c)=>(
              <tr key={c._id}>

                <td>
  <button
    type="button"
    onClick={() => select(c)}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => remove(c._id)}
    style={{ marginLeft: "10px", color: "red" }}
  >
    Delete
  </button>
</td>

                <td>
                  {c.name}
                </td>

                <td>
                  {c.course}
                </td>

                <td>
                  {
                    c.certificateType
                  }
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="certificate">

        <div className="certificate-border">

          <img src={logo} alt="ERAM Engineering" className="certificate-logo" />

          <h1 className="title">
            {title}
          </h1>

          <h2 className="subtitle">
            {subtitle}
          </h2>

          <p className="text">
            This is proudly presented to
          </p>

          <h1 className="name">
            {
              form.name ||
              "STUDENT NAME"
            }
          </h1>

          <p className="text">
            {text}
          </p>

          <h2 className="course">
            {
              form.course ||
              "COURSE NAME"
            }
          </h2>

          <div className="info">

            <div className="info-box">

              <p className="label">
                CERTIFICATE ID
              </p>

              <p className="value">
                {
                  certificateId
                }
              </p>

              <p className="sub-label">
                INSTRUCTOR
              </p>

              <p className="sub-value">
                {
                  form.instructor ||
                  "-"
                }
              </p>

            </div>

            <div className="info-box">

              <p className="label">
                DATE
              </p>

              <p className="value">
                {
                  form.date ||
                  "-"
                }
              </p>

              <p className="sub-label">
                DIRECTOR
              </p>

              <p className="sub-value">
                {
                  form.director ||
                  "-"
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;