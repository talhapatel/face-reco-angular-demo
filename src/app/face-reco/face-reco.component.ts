import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import * as faceApi from '../../assets/face-api.min.js'
import { trainedDataList } from '../face-reco-admin/localData'

@Component({
  selector: 'app-face-reco',
  templateUrl: './face-reco.component.html',
  styleUrls: ['./face-reco.component.css']
})
@Injectable()
export class FaceRecoComponent implements OnInit, OnDestroy {
  @ViewChild("canvas")
  public canvas: ElementRef;
  @ViewChild("video")
  public video: ElementRef;

  private localDescripterList = [];
  private foundEmpId: any;
  private foundEmpName: any;

  private attendenceList = []

  showStop: boolean = false;

  constructor() { }

  async ngOnInit() {

    await this.loadModule();

    trainedDataList.forEach(data => {
      if (data && data != null) {
        /*         let float32Converter = faceProfile._descriptors.map(desc => new Float32Array(Object.keys(desc).map(key => desc[key])))
                const localDescriptors = new faceApi.LabeledFaceDescriptors(faceProfile._label, float32Converter);
                this.localDescripterList.push(localDescriptors) */
        let float32Converter = data._descriptors.map(desc => new Float32Array(Object.values(desc)))
        /* let float32Converter = data._descriptors.map(desc => new Float32Array(Object.keys(desc).map(key => desc[key]))) */
        const localDescriptors = new faceApi.LabeledFaceDescriptors(data.label, float32Converter);
        this.localDescripterList.push(localDescriptors)
      }
    });
    console.log(trainedDataList)
  }

  onPlayVideo() {

    let accurecy = 0.45;
    let faceMatcher = new faceApi.FaceMatcher(this.localDescripterList, 0.6)
    const displaySize = { width: this.video.nativeElement.width, height: this.video.nativeElement.height }
    faceApi.matchDimensions(this.canvas, displaySize)
    let timeout = setInterval(async () => {

      const detections = await faceApi.detectSingleFace(this.video.nativeElement, new faceApi.TinyFaceDetectorOptions({ minConfidence: 0.8, inputSize: 192 })).withFaceLandmarks().withFaceDescriptor()
      const detections1 = await faceApi.detectSingleFace(this.video.nativeElement, new faceApi.SsdMobilenetv1Options({ minConfidence: 0.8 })).withFaceLandmarks().withFaceDescriptor()
      if (detections != undefined && detections1 != undefined) {
        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        clearTimeout(timeout)

        this.video.nativeElement.pause();

        const bestMatch = faceMatcher.findBestMatch(detections.descriptor)
        const bestMatch1 = faceMatcher.findBestMatch(detections1.descriptor)
        const results = bestMatch.toString()
        const results1 = bestMatch1.toString()
        if (results.split(' ')[0] != 'unknown' && results1.split(' ')[0] != 'unknown') {
          if (results.split('-')[1].substr(0, 6) === results1.split('-')[1].substr(0, 6) &&
            (parseFloat(results.substr(results.indexOf('(') + 1, results.length - 2)) <= accurecy
              || parseFloat(results1.substr(results1.indexOf('(') + 1, results1.length - 2)) <= accurecy)) {
            console.log(results)
            const index = results.lastIndexOf('-');
            this.foundEmpId = results.substr(index + 1, 6).trim();
            this.foundEmpName = results.substr(0, index);
            console.log(this.foundEmpId, this.foundEmpName)
            if (this.attendenceList.findIndex(data => this.foundEmpId != data.empId) == -1) {
              let emp = { empId: this.foundEmpId, empName: this.foundEmpName }

              this.attendenceList.push(emp)
            }
          }
        }

      }
      this.video.nativeElement.play();

    }, 1000)

  }

  startRecognization() {


    this.startVideo()
    this.showStop = true;

  }
  stopRecognization() {
    this.stopVideo()
    this.showStop = false;

  }
  stopVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.video.nativeElement.pause()
        this.video.nativeElement.srcObject = null;
        stream.getTracks().forEach(track => track.stop())
      })
  }
  startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
        return this.video.nativeElement.play();
      })
  }
  ngOnDestroy() {



  }
  async loadModule() {
    await faceApi.nets.faceRecognitionNet.loadFromUri("assets/models")
    await faceApi.nets.faceLandmark68Net.loadFromUri("assets/models");
    await faceApi.nets.ssdMobilenetv1.loadFromUri("assets/models");
    await faceApi.nets.tinyFaceDetector.loadFromUri("assets/models")
  }


}
